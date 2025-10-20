import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, filter, map, retry, shareReplay, timer } from 'rxjs';
import { Group } from '../../types/group.type';

type ReturnGroups = {
  groups: Group[];
  avgShouldBeExpelled: number | null;
  minByExpelled: Group | null;
  minByAdmin: Group[] | null;
};

type SubscribeCmd = { type: 'subscribe'; minAdminHeight: number };
type WsMessage = ReturnGroups | SubscribeCmd;

function normalize(p: ReturnGroups): Required<
  Omit<ReturnGroups, 'avgShouldBeExpelled' | 'minByExpelled'>
> & {
  avgShouldBeExpelled: number | null;
  minByExpelled: Group | null;
} {
  return {
    groups: p.groups ?? [],
    avgShouldBeExpelled: p.avgShouldBeExpelled ?? null,
    minByExpelled: p.minByExpelled ?? null,
    minByAdmin: p.minByAdmin ?? [],
  };
}

function isReturnGroups(msg: unknown): msg is ReturnGroups {
  return !!msg && typeof msg === 'object' && Array.isArray((msg as any).groups);
}

@Injectable({ providedIn: 'root' })
export class GroupsWsService {
  private socket$?: WebSocketSubject<WsMessage>;
  private stream$?: Observable<ReturnGroups>;

  connect(minAdminHeight = 0): Observable<ReturnGroups> {
    if (!this.stream$) {
      const url = `ws://localhost:8080/ws/groups`;

      const s$ = webSocket<WsMessage>({
        url,
        deserializer: (e) => JSON.parse(e.data),
        openObserver: {
          next: () => s$.next({ type: 'subscribe', minAdminHeight }),
        },
      });

      this.socket$ = s$;
      this.stream$ = s$.pipe(
        filter(isReturnGroups),
        map(normalize),
        retry({ count: Infinity, delay: (_e, i) => timer(Math.min(30000, 1000 * 2 ** i)) }),
        shareReplay({ bufferSize: 1, refCount: true }),
      );
    }
    return this.stream$!;
  }

  close() {
    this.socket$?.complete();
    this.socket$ = undefined;
    this.stream$ = undefined;
  }
}
