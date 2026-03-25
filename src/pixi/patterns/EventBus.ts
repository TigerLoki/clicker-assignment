export type GamePhase = "idle" | "playing" | "milestone";

type EventHandler<T = unknown> = (payload: T) => void;

export interface Subscription {
  unsubscribe(): void;
}

export interface GameEvents {
  "coin:click": { x: number; y: number };
  "score:changed": { score: number };
  "highscore:changed": { highScore: number };
  "phase:changed": { phase: GamePhase };
  "milestone:reached": { score: number };
}

export type GameEventName = keyof GameEvents;

export class EventBus {
  private static instance: EventBus | null = null;
  private listeners = new Map<string, Set<EventHandler<unknown>>>();

  private constructor() {}

  static getInstance(): EventBus {
    if (!EventBus.instance) EventBus.instance = new EventBus();
    return EventBus.instance;
  }

  on<K extends GameEventName>(
    event: K,
    handler: EventHandler<GameEvents[K]>,
  ): Subscription {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    const handlers = this.listeners.get(event)!;
    handlers.add(handler as EventHandler<unknown>);
    return {
      unsubscribe: () => handlers.delete(handler as EventHandler<unknown>),
    };
  }

  publish<K extends GameEventName>(event: K, payload: GameEvents[K]): void {
    this.listeners.get(event)?.forEach((h) => h(payload));
  }
}
