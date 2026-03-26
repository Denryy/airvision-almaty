// ─────────────────────────────────────────────────────────────────────────────
// lib/routing/cleanRoute.ts
//
// AQI-weighted Dijkstra pathfinder for Almaty districts.
// Cost function: cost(edge) = distance_km * (1 + avgAQI / 100)
// This penalises traversal through polluted districts — the higher the AQI,
// the more "expensive" it is to route through that area, so the algorithm
// naturally prefers cleaner corridors.
// ─────────────────────────────────────────────────────────────────────────────

export interface DistrictNode {
  id: string;
  name: string;
  nameRu: string;
  /** WGS-84 centre-point of the district (used for distance & map rendering) */
  lat: number;
  lng: number;
  /** Current AQI reading (0–500). Updated from live/mock sensor data. */
  aqi: number;
}

export interface RouteEdge {
  from: string;
  to: string;
  /** Straight-line distance in kilometres between district centres */
  distanceKm: number;
}

export interface RouteResult {
  path: DistrictNode[];
  totalDistanceKm: number;
  avgAqi: number;
  /** Pollution-weighted cost (lower = cleaner) */
  weightedCost: number;
}

// ─── Almaty district graph ────────────────────────────────────────────────────
// 8 districts mapped to their approximate geographic centres.
// Coordinates sourced from OpenStreetMap administrative boundaries.

export const DISTRICTS: Record<string, DistrictNode> = {
  alatau: {
    id: "alatau",
    name: "Alatau",
    nameRu: "Алатауский",
    lat: 43.37,
    lng: 76.84,
    aqi: 45,
  },
  almaly: {
    id: "almaly",
    name: "Almaly",
    nameRu: "Алмалинский",
    lat: 43.255,
    lng: 76.945,
    aqi: 112,
  },
  auezov: {
    id: "auezov",
    name: "Auezov",
    nameRu: "Ауэзовский",
    lat: 43.225,
    lng: 76.87,
    aqi: 138,
  },
  bostandyk: {
    id: "bostandyk",
    name: "Bostandyk",
    nameRu: "Бостандыкский",
    lat: 43.27,
    lng: 76.93,
    aqi: 68,
  },
  zhetysu: {
    id: "zhetysu",
    name: "Zhetysu",
    nameRu: "Жетысуский",
    lat: 43.295,
    lng: 77.03,
    aqi: 95,
  },
  medeu: {
    id: "medeu",
    name: "Medeu",
    nameRu: "Медеуский",
    lat: 43.215,
    lng: 76.97,
    aqi: 52,
  },
  nauryzbay: {
    id: "nauryzbay",
    name: "Nauryzbay",
    nameRu: "Наурызбайский",
    lat: 43.19,
    lng: 76.82,
    aqi: 155,
  },
  turksib: {
    id: "turksib",
    name: "Turksib",
    nameRu: "Турксибский",
    lat: 43.33,
    lng: 77.06,
    aqi: 118,
  },
};

// Adjacency list — only geographically adjacent districts are connected.
// Each pair is listed once; the algorithm treats edges as bidirectional.
export const EDGES: RouteEdge[] = [
  { from: "alatau",    to: "nauryzbay", distanceKm: 6.1 },
  { from: "alatau",    to: "auezov",    distanceKm: 7.2 },
  { from: "alatau",    to: "bostandyk", distanceKm: 9.0 },
  { from: "nauryzbay", to: "auezov",    distanceKm: 4.8 },
  { from: "auezov",    to: "almaly",    distanceKm: 5.5 },
  { from: "auezov",    to: "bostandyk", distanceKm: 6.3 },
  { from: "almaly",    to: "bostandyk", distanceKm: 3.9 },
  { from: "almaly",    to: "zhetysu",   distanceKm: 5.1 },
  { from: "almaly",    to: "medeu",     distanceKm: 4.4 },
  { from: "bostandyk", to: "medeu",     distanceKm: 5.8 },
  { from: "bostandyk", to: "zhetysu",   distanceKm: 7.6 },
  { from: "zhetysu",   to: "turksib",   distanceKm: 6.2 },
  { from: "medeu",     to: "zhetysu",   distanceKm: 6.9 },
  { from: "alatau",    to: "turksib",   distanceKm: 11.4 },
  { from: "turksib",   to: "almaly",    distanceKm: 8.3 },
];

// ─── Graph builder ─────────────────────────────────────────────────────────────

type AdjacencyMap = Map<string, Array<{ nodeId: string; distanceKm: number }>>;

function buildAdjacencyMap(): AdjacencyMap {
  const map: AdjacencyMap = new Map();

  for (const id of Object.keys(DISTRICTS)) {
    map.set(id, []);
  }

  for (const edge of EDGES) {
    map.get(edge.from)!.push({ nodeId: edge.to,   distanceKm: edge.distanceKm });
    map.get(edge.to)!.push({   nodeId: edge.from, distanceKm: edge.distanceKm });
  }

  return map;
}

// ─── Cost functions ────────────────────────────────────────────────────────────

/**
 * AQI-weighted edge cost.
 * Passing through a district with AQI=150 costs 2.5× the raw distance,
 * while AQI=0 costs 1× the raw distance.
 * We average the AQI of both endpoint districts for the edge cost.
 */
function pollutionCost(
  distanceKm: number,
  fromAqi: number,
  toAqi: number
): number {
  const avgAqi = (fromAqi + toAqi) / 2;
  return distanceKm * (1 + avgAqi / 100);
}

/** Pure distance cost — no AQI weighting. Used for the "normal" route. */
function distanceCost(distanceKm: number): number {
  return distanceKm;
}

// ─── Minimal priority queue (binary min-heap) ──────────────────────────────────
// Avoids any external dependency.

class MinHeap<T extends { priority: number }> {
  private heap: T[] = [];

  push(item: T): void {
    this.heap.push(item);
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.sinkDown(0);
    }
    return top;
  }

  get size(): number {
    return this.heap.length;
  }

  private bubbleUp(i: number): void {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.heap[parent].priority <= this.heap[i].priority) break;
      [this.heap[parent], this.heap[i]] = [this.heap[i], this.heap[parent]];
      i = parent;
    }
  }

  private sinkDown(i: number): void {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < n && this.heap[l].priority < this.heap[smallest].priority) smallest = l;
      if (r < n && this.heap[r].priority < this.heap[smallest].priority) smallest = r;
      if (smallest === i) break;
      [this.heap[smallest], this.heap[i]] = [this.heap[i], this.heap[smallest]];
      i = smallest;
    }
  }
}

// ─── Dijkstra core ─────────────────────────────────────────────────────────────

function dijkstra(
  startId: string,
  endId: string,
  adjacency: AdjacencyMap,
  districts: Record<string, DistrictNode>,
  useAqiWeighting: boolean
): RouteResult | null {
  const dist = new Map<string, number>();
  const prev = new Map<string, string | null>();

  for (const id of Object.keys(districts)) {
    dist.set(id, Infinity);
    prev.set(id, null);
  }
  dist.set(startId, 0);

  const pq = new MinHeap<{ priority: number; nodeId: string }>();
  pq.push({ priority: 0, nodeId: startId });

  while (pq.size > 0) {
    const { nodeId: current } = pq.pop()!;

    if (current === endId) break;

    const neighbours = adjacency.get(current) ?? [];

    for (const { nodeId: neighbour, distanceKm } of neighbours) {
      const fromAqi = districts[current].aqi;
      const toAqi   = districts[neighbour].aqi;

      const edgeCost = useAqiWeighting
        ? pollutionCost(distanceKm, fromAqi, toAqi)
        : distanceCost(distanceKm);

      const newDist = dist.get(current)! + edgeCost;

      if (newDist < dist.get(neighbour)!) {
        dist.set(neighbour, newDist);
        prev.set(neighbour, current);
        pq.push({ priority: newDist, nodeId: neighbour });
      }
    }
  }

  // Reconstruct path
  if (dist.get(endId) === Infinity) return null; // no path

  const path: DistrictNode[] = [];
  let cursor: string | null = endId;
  while (cursor !== null) {
    path.unshift(districts[cursor]);
    cursor = prev.get(cursor) ?? null;
  }

  // Compute metrics
  let totalDistanceKm = 0;
  let totalAqi = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const edge = EDGES.find(
      (e) =>
        (e.from === path[i].id && e.to === path[i + 1].id) ||
        (e.to === path[i].id && e.from === path[i + 1].id)
    );
    if (edge) totalDistanceKm += edge.distanceKm;
    totalAqi += path[i].aqi;
  }
  totalAqi += path[path.length - 1].aqi;

  const avgAqi = Math.round(totalAqi / path.length);

  return {
    path,
    totalDistanceKm: Math.round(totalDistanceKm * 10) / 10,
    avgAqi,
    weightedCost: Math.round(dist.get(endId)! * 10) / 10,
  };
}

// ─── Public API ────────────────────────────────────────────────────────────────

export interface RouteComparison {
  clean: RouteResult;
  normal: RouteResult;
  /** Percentage reduction in average AQI exposure */
  exposureReductionPct: number;
  /** Percentage increase in distance (clean routes are sometimes longer) */
  distanceDeltaPct: number;
}

/**
 * Compute both the shortest-distance route and the cleanest-air route
 * between two district IDs, then return a comparison object.
 */
export function computeRoutes(
  startId: string,
  endId: string,
  liveDistricts?: Record<string, DistrictNode>
): RouteComparison | null {
  const districts = liveDistricts ?? DISTRICTS;
  const adjacency = buildAdjacencyMap();

  const clean  = dijkstra(startId, endId, adjacency, districts, true);
  const normal = dijkstra(startId, endId, adjacency, districts, false);

  if (!clean || !normal) return null;

  const exposureReductionPct = normal.avgAqi > 0
    ? Math.round(((normal.avgAqi - clean.avgAqi) / normal.avgAqi) * 100)
    : 0;

  const distanceDeltaPct = normal.totalDistanceKm > 0
    ? Math.round(
        ((clean.totalDistanceKm - normal.totalDistanceKm) /
          normal.totalDistanceKm) *
          100
      )
    : 0;

  return { clean, normal, exposureReductionPct, distanceDeltaPct };
}

/**
 * Convert a list of district nodes into SVG polyline-compatible coordinates.
 * The caller supplies the map viewport dimensions and bounding box.
 */
export function pathToSvgPoints(
  path: DistrictNode[],
  viewport: { width: number; height: number },
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number },
  padding = 40
): Array<{ x: number; y: number }> {
  const { width, height } = viewport;
  const { minLat, maxLat, minLng, maxLng } = bounds;
  const latRange = maxLat - minLat || 0.001;
  const lngRange = maxLng - minLng || 0.001;

  return path.map((node) => ({
    x:
      padding +
      ((node.lng - minLng) / lngRange) * (width - padding * 2),
    y:
      padding +
      ((maxLat - node.lat) / latRange) * (height - padding * 2),
  }));
}

/** Returns the AQI colour category for visual overlays */
export function aqiColor(aqi: number): string {
  if (aqi <= 50)  return "#22c55e"; // Good
  if (aqi <= 100) return "#f59e0b"; // Moderate
  if (aqi <= 150) return "#f97316"; // Unhealthy for Sensitive Groups
  if (aqi <= 200) return "#ef4444"; // Unhealthy
  if (aqi <= 300) return "#a855f7"; // Very Unhealthy
  return "#7f1d1d";                  // Hazardous
}

export function aqiLabel(aqi: number): string {
  if (aqi <= 50)  return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Sensitive";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}
