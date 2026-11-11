// Ambientación de cada escuela y objetos de los casos. Todo decorativo: oculto a lectores de pantalla.

function engranaje(dientes: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < dientes * 4; i++) {
    const radio = i % 4 < 2 ? r : r * 0.8;
    const ang = (i / (dientes * 4)) * Math.PI * 2;
    pts.push(`${(Math.cos(ang) * radio).toFixed(1)},${(Math.sin(ang) * radio).toFixed(1)}`);
  }
  return `M${pts.join('L')}Z`;
}
const ENGRANAJE = engranaje(10, 40);

/** Escuela marxista: fábrica, chimeneas y engranajes que no paran. */
export function Fabrica() {
  return (
    <svg className="esc-dibujo" viewBox="0 0 200 300" preserveAspectRatio="xMinYMax slice" aria-hidden="true">
      <g className="esc-tinta">
        <path d="M0 300V170L28 150V170L56 150V170L84 150V300Z" />
        <path d="M12 150V70H30V150Z" />
        <path d="M44 150V96H58V150Z" />
      </g>
      <g className="esc-humo">
        <circle cx="21" cy="52" r="11" />
        <circle cx="36" cy="34" r="15" />
        <circle cx="58" cy="20" r="10" />
      </g>
      <g transform="translate(118 62)"><path className="esc-tinta esc-gira" d={ENGRANAJE} /></g>
      <g transform="translate(170 118) scale(.62)"><path className="esc-tinta esc-gira-inv" d={ENGRANAJE} /></g>
    </svg>
  );
}

/** Escuela neoclásica: pizarra con las curvas de oferta y demanda, y una balanza. */
export function Pizarra() {
  return (
    <svg className="esc-dibujo" viewBox="0 0 200 300" preserveAspectRatio="xMaxYMax slice" aria-hidden="true">
      <g className="esc-tiza">
        <path d="M70 30V130H186" />
        <path className="esc-curva" d="M84 44C104 92 136 112 176 118" />
        <path className="esc-curva" d="M84 118C120 112 152 88 174 44" />
        <circle cx="128" cy="91" r="4.5" className="esc-punto" />
        <path d="M128 91V130M70 91H128" strokeDasharray="4 6" />
      </g>
      <g className="esc-tiza esc-balanza">
        <path d="M150 170V236M132 236H168M118 184L182 172" />
        <path d="M118 184L108 212H128Z M182 172L172 200H192Z" />
      </g>
    </svg>
  );
}

export function Objeto({ tipo }: { tipo: 'tinto' | 'diamante' | 'costura' }) {
  return (
    <svg className="objeto-dibujo" viewBox="0 0 80 80" aria-hidden="true">
      {tipo === 'tinto' && (
        <g className="ob">
          <path className="ob-vapor" d="M32 22C28 16 36 12 32 5M46 22C42 16 50 12 46 5" />
          <path className="ob-lleno" d="M20 30H58L54 58C53 63 49 66 44 66H34C29 66 25 63 24 58Z" />
          <path d="M58 36C70 34 70 52 56 52" />
          <path d="M12 72H66" />
        </g>
      )}
      {tipo === 'diamante' && (
        <g className="ob">
          <path className="ob-papel" d="M8 30H34L31 70H11Z" />
          <path className="ob-lleno" d="M10.500 46H32.200L31 70H11Z" />
          <path className="ob-papel" d="M44 30L52 20H68L76 30L60 54Z" />
          <path d="M44 30H76M52 20L56 30L60 54L64 30L68 20" />
        </g>
      )}
      {tipo === 'costura' && (
        <g className="ob">
          <path className="ob-lleno" d="M12 26C12 20 16 18 22 18H58C66 18 68 24 68 30V40H56V32H26V54H12Z" />
          <path d="M62 40V52M6 62H74M6 54H40V62" />
          <circle className="ob-papel" cx="19" cy="34" r="5" />
        </g>
      )}
    </svg>
  );
}

/** Los golpes son argumentos: Marx lanza un reloj de fábrica; Marshall, sus curvas cruzadas. */
export function Proyectil({ lado }: { lado: 'a' | 'b' }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      {lado === 'a' ? (
        <g className="ob">
          <circle className="ob-papel" cx="24" cy="26" r="17" />
          <path d="M24 14V26L32 31M19 4H29M24 4V9" />
        </g>
      ) : (
        <g className="ob">
          <circle className="ob-papel" cx="24" cy="24" r="20" />
          <path d="M11 12C18 26 26 33 38 36M11 36C22 33 30 24 37 12" />
        </g>
      )}
    </svg>
  );
}
