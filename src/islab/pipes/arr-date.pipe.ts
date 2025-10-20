import { Pipe, PipeTransform } from '@angular/core';

type BackendDate = string | number[] | null | undefined;

@Pipe({ name: 'arrDate', standalone: true, pure: true })
export class ArrDatePipe implements PipeTransform {
  transform(value: BackendDate, offsetHours = 3): string {
    const pad = (n: number) => String(n).padStart(2, '0');

    let y: number,
      m: number,
      d: number,
      H = 0,
      M = 0;

    if (Array.isArray(value) && value.length >= 3) {
      [y, m, d, H = 0, M = 0] = value.map(Number);
    } else if (typeof value === 'string') {
      if (/^\d{2}-\d{2}-\d{4}-\d{2}-\d{2}$/.test(value)) return value;

      const re = /^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2})(?::(\d{2}))?(?::\d{2})?(?:\.\d+)?(?:Z)?$/;
      const mch = value.match(re);
      if (!mch) return '';
      y = +mch[1];
      m = +mch[2];
      d = +mch[3];
      H = +(mch[4] ?? 0);
      M = +(mch[5] ?? 0);
    } else {
      return '';
    }

    const dt = new Date(Date.UTC(y, (m || 1) - 1, d || 1, H || 0, M || 0));
    if (offsetHours) dt.setUTCHours(dt.getUTCHours() + offsetHours);

    const dd = pad(dt.getUTCDate());
    const MM = pad(dt.getUTCMonth() + 1);
    const yyyy = dt.getUTCFullYear();
    const HH = pad(dt.getUTCHours());
    const mm = pad(dt.getUTCMinutes());

    return `${dd}-${MM}-${yyyy}-${HH}-${mm}`;
  }
}
