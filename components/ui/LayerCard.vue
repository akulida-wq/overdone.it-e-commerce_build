<script setup>
// V2 S3 layer cards (Figma «Layer 16:9 v3 — …», originally authored here and
// placed into the mockup). 640×360 line-art, colors via theme tokens.
// name: site | pay | delivery | analytics | crm | stock | notify
defineProps({
  name: { type: String, required: true }
})
</script>

<template>
  <svg class="layer-card" viewBox="0 0 640 360" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="0.5" y="0.5" width="639" height="359" rx="24" fill="var(--color-surface)" stroke="var(--color-border-strong)" />

    <!-- Сайт: full storefront -->
    <g v-if="name === 'site'">
      <rect x="48" y="40" width="544" height="280" rx="14" fill="var(--color-surface-2)" />
      <rect x="49" y="41" width="542" height="278" rx="14" stroke="var(--color-border-strong)" stroke-width="2" />
      <path d="M48 88h544" stroke="var(--color-border-strong)" stroke-width="2" />
      <circle cx="74" cy="64" r="5" fill="var(--color-accent)" /><circle cx="92" cy="64" r="5" stroke="var(--color-text-muted)" stroke-width="2" /><circle cx="110" cy="64" r="5" stroke="var(--color-text-muted)" stroke-width="2" />
      <rect x="134" y="54" width="220" height="20" rx="10" stroke="var(--color-text-muted)" stroke-width="2" />
      <path d="M554 58l4 12h12l4-12M558 74a2 2 0 100.1 0M570 74a2 2 0 100.1 0" stroke="var(--color-text-muted)" stroke-width="2" stroke-linejoin="round" />
      <rect x="76" y="108" width="200" height="118" rx="10" stroke="var(--color-text-muted)" stroke-width="2" />
      <circle cx="128" cy="146" r="10" stroke="var(--color-text-muted)" stroke-width="2" />
      <path d="M92 210l40-38 30 26 24-20 36 32" stroke="var(--color-text-muted)" stroke-width="2" stroke-linejoin="round" />
      <rect x="304" y="116" width="190" height="16" rx="8" fill="var(--color-text)" opacity="0.85" />
      <rect x="304" y="146" width="230" height="10" rx="5" fill="var(--color-text-muted)" opacity="0.55" />
      <rect x="304" y="164" width="170" height="10" rx="5" fill="var(--color-text-muted)" opacity="0.4" />
      <rect x="304" y="186" width="92" height="12" rx="6" fill="var(--color-text-muted)" />
      <rect x="304" y="210" width="132" height="30" rx="15" fill="var(--color-accent)" />
      <g v-for="(x, i) in [76, 252, 428]" :key="i">
        <rect :x="x" y="248" :width="i === 2 ? 136 : 160" height="54" rx="8" stroke="var(--color-text-muted)" stroke-width="2" />
        <rect :x="x + 12" y="260" width="30" height="30" rx="6" stroke="var(--color-text-muted)" stroke-width="2" />
        <rect :x="x + 52" y="264" :width="i === 2 ? 66 : 80" height="8" rx="4" fill="var(--color-text-muted)" opacity="0.55" />
        <rect :x="x + 52" y="280" :width="i === 2 ? 40 : 48" height="8" rx="4" fill="var(--color-text-muted)" opacity="0.35" />
      </g>
    </g>

    <!-- CRM: kanban -->
    <g v-else-if="name === 'crm'">
      <g v-for="(col, c) in [48, 237, 426]" :key="c">
        <rect :x="col" y="52" width="165" height="22" rx="6" fill="var(--color-surface-2)" />
        <rect :x="col + 12" y="59" width="70" height="8" rx="4" fill="var(--color-text-muted)" opacity="0.6" />
      </g>
      <g v-for="(card, i) in [[48,92,0],[48,160,0],[48,228,0],[237,92,1],[237,160,0],[426,92,0],[426,160,0],[426,228,0]]" :key="'c'+i">
        <rect :x="card[0]" :y="card[1]" width="165" height="56" rx="8" :stroke="card[2] ? 'var(--color-accent)' : 'var(--color-text-muted)'" stroke-width="2" />
        <circle :cx="card[0] + 22" :cy="card[1] + 20" r="8" :stroke="card[2] ? 'var(--color-accent)' : 'var(--color-text-muted)'" stroke-width="2" />
        <rect :x="card[0] + 40" :y="card[1] + 14" :width="card[2] ? 96 : 82" height="8" rx="4" :fill="card[2] ? 'var(--color-accent)' : 'var(--color-text-muted)'" :opacity="card[2] ? 0.9 : 0.55" />
        <rect :x="card[0] + 40" :y="card[1] + 30" width="60" height="8" rx="4" fill="var(--color-text-muted)" opacity="0.35" />
        <rect :x="card[0] + 14" :y="card[1] + 42" width="34" height="6" rx="3" fill="var(--color-text-muted)" opacity="0.3" />
      </g>
      <path d="M213 120h24M420 120h6" stroke="var(--color-text-muted)" stroke-width="2" stroke-dasharray="3 6" />
    </g>

    <!-- Платіжний сервіс: payment window → system record -->
    <g v-else-if="name === 'pay'">
      <rect x="48" y="72" width="240" height="216" rx="12" stroke="var(--color-text-muted)" stroke-width="2" />
      <rect x="72" y="96" width="120" height="12" rx="6" fill="var(--color-text-muted)" opacity="0.6" />
      <rect x="72" y="126" width="192" height="40" rx="8" stroke="var(--color-text-muted)" stroke-width="2" />
      <rect x="84" y="138" width="24" height="16" rx="3" stroke="var(--color-text-muted)" stroke-width="2" />
      <rect x="120" y="142" width="28" height="8" rx="4" fill="var(--color-text-muted)" opacity="0.5" /><rect x="156" y="142" width="28" height="8" rx="4" fill="var(--color-text-muted)" opacity="0.5" /><rect x="192" y="142" width="28" height="8" rx="4" fill="var(--color-text-muted)" opacity="0.5" />
      <rect x="72" y="180" width="92" height="26" rx="6" stroke="var(--color-text-muted)" stroke-width="2" />
      <rect x="172" y="180" width="92" height="26" rx="6" stroke="var(--color-text-muted)" stroke-width="2" />
      <rect x="72" y="226" width="192" height="34" rx="17" fill="var(--color-accent)" />
      <path d="M300 180h48" stroke="var(--color-text-muted)" stroke-width="2" stroke-dasharray="4 7" stroke-linecap="round" />
      <path d="M342 174l8 6-8 6" stroke="var(--color-text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <rect x="368" y="56" width="224" height="248" rx="12" stroke="var(--color-text-muted)" stroke-width="2" />
      <rect x="390" y="78" width="96" height="10" rx="5" fill="var(--color-text-muted)" opacity="0.6" />
      <path d="M556 76c-9 0-16 3-16 8s7 8 16 8 16-3 16-8-7-8-16-8ZM540 84v14c0 5 7 8 16 8s16-3 16-8V84" stroke="var(--color-text-muted)" stroke-width="2" />
      <path d="M368 108h224" stroke="var(--color-text-muted)" stroke-width="2" opacity="0.4" />
      <g v-for="(row, i) in [[124, 110], [152, 90], [180, 120]]" :key="'r'+i">
        <rect x="390" :y="row[0]" :width="row[1]" height="9" rx="4.5" fill="var(--color-text-muted)" opacity="0.5" />
        <rect x="522" :y="row[0]" width="48" height="9" rx="4.5" fill="var(--color-text-muted)" opacity="0.5" />
      </g>
      <path d="M380 208h200" stroke="var(--color-text-muted)" stroke-width="2" stroke-dasharray="3 6" opacity="0.5" />
      <rect x="382" y="222" width="196" height="40" rx="8" stroke="var(--color-accent)" stroke-width="2" />
      <circle cx="406" cy="242" r="10" stroke="var(--color-accent)" stroke-width="2" />
      <path d="M401 242l4 4 7-8" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <rect x="428" y="237" width="86" height="9" rx="4.5" fill="var(--color-accent)" opacity="0.9" /><rect x="524" y="237" width="42" height="9" rx="4.5" fill="var(--color-text)" opacity="0.8" />
      <rect x="390" y="278" width="140" height="8" rx="4" fill="var(--color-text-muted)" opacity="0.3" />
    </g>

    <!-- Облік залишків: stock table -->
    <g v-else-if="name === 'stock'">
      <rect x="48" y="44" width="544" height="272" rx="12" stroke="var(--color-text-muted)" stroke-width="2" />
      <rect x="72" y="64" width="120" height="11" rx="5.5" fill="var(--color-text-muted)" opacity="0.6" />
      <path d="M556 64a12 12 0 11-8 21M556 64l-2-8M556 64l8-3" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round" />
      <path d="M48 96h544" stroke="var(--color-text-muted)" stroke-width="2" opacity="0.4" />
      <g v-for="(y, i) in [112, 174, 236]" :key="i">
        <rect x="72" :y="y" width="34" height="34" rx="6" :stroke="i === 1 ? 'var(--color-accent)' : 'var(--color-text-muted)'" stroke-width="2" />
        <rect x="122" :y="y + 6" width="140" height="9" rx="4.5" fill="var(--color-text-muted)" opacity="0.55" />
        <rect x="122" :y="y + 22" width="86" height="7" rx="3.5" fill="var(--color-text-muted)" opacity="0.3" />
        <rect x="320" :y="y + 4" width="70" height="26" rx="13" stroke="var(--color-text-muted)" stroke-width="2" opacity="0.7" />
        <rect x="340" :y="y + 13" width="30" height="8" rx="4" fill="var(--color-text-muted)" opacity="0.5" />
        <template v-if="i === 1">
          <path :d="`M402 ${y + 17}h24`" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round" />
          <path :d="`M420 ${y + 11}l8 6-8 6`" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          <rect x="440" :y="y + 4" width="70" height="26" rx="13" stroke="var(--color-accent)" stroke-width="2" />
          <rect x="458" :y="y + 13" width="34" height="8" rx="4" fill="var(--color-accent)" opacity="0.9" />
        </template>
        <template v-else>
          <rect x="440" :y="y + 4" width="70" height="26" rx="13" stroke="var(--color-text-muted)" stroke-width="2" />
          <rect x="460" :y="y + 13" width="30" height="8" rx="4" fill="var(--color-text-muted)" opacity="0.5" />
        </template>
        <path v-if="i < 2" :d="`M64 ${y + 48}h512`" stroke="var(--color-text-muted)" stroke-width="2" stroke-dasharray="3 6" opacity="0.35" />
      </g>
    </g>

    <!-- Інтеграція доставки: order → API → waybill -->
    <g v-else-if="name === 'delivery'">
      <rect x="48" y="96" width="176" height="168" rx="10" stroke="var(--color-text-muted)" stroke-width="2" />
      <rect x="70" y="116" width="90" height="10" rx="5" fill="var(--color-text-muted)" opacity="0.6" />
      <rect x="70" y="140" width="132" height="8" rx="4" fill="var(--color-text-muted)" opacity="0.4" />
      <rect x="70" y="158" width="132" height="8" rx="4" fill="var(--color-text-muted)" opacity="0.4" />
      <rect x="70" y="176" width="96" height="8" rx="4" fill="var(--color-text-muted)" opacity="0.4" />
      <rect x="70" y="204" width="42" height="38" rx="5" stroke="var(--color-text-muted)" stroke-width="2" />
      <path d="M70 218h42M91 204v14" stroke="var(--color-text-muted)" stroke-width="2" />
      <path d="M224 180h40" stroke="var(--color-text-muted)" stroke-width="2" stroke-dasharray="4 7" stroke-linecap="round" />
      <circle cx="288" cy="180" r="22" stroke="var(--color-text-muted)" stroke-width="2" />
      <circle cx="288" cy="180" r="7" stroke="var(--color-accent)" stroke-width="2" />
      <path d="M310 180h40" stroke="var(--color-text-muted)" stroke-width="2" stroke-dasharray="4 7" stroke-linecap="round" />
      <path d="M344 174l8 6-8 6" stroke="var(--color-text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      <rect x="368" y="52" width="224" height="256" rx="10" stroke="var(--color-text-muted)" stroke-width="2" />
      <rect x="392" y="74" width="104" height="11" rx="5.5" fill="var(--color-text)" opacity="0.8" />
      <rect x="536" y="70" width="40" height="20" rx="10" stroke="var(--color-accent)" stroke-width="2" />
      <rect x="392" y="104" width="150" height="8" rx="4" fill="var(--color-text-muted)" opacity="0.45" />
      <rect x="392" y="122" width="126" height="8" rx="4" fill="var(--color-text-muted)" opacity="0.45" />
      <rect x="392" y="140" width="150" height="8" rx="4" fill="var(--color-text-muted)" opacity="0.45" />
      <rect x="392" y="158" width="100" height="8" rx="4" fill="var(--color-text-muted)" opacity="0.45" />
      <path d="M368 190h224" stroke="var(--color-text-muted)" stroke-width="2" stroke-dasharray="6 8" />
      <rect x="392" y="204" width="80" height="9" rx="4.5" fill="var(--color-text-muted)" opacity="0.55" />
      <g fill="var(--color-text-muted)">
        <rect v-for="(b, i) in [[392,3],[400,6],[411,3],[419,9],[433,3],[441,3],[449,6],[460,3],[468,9],[482,3],[490,6],[501,3],[509,3],[517,9],[531,3],[539,6],[550,3],[558,3],[566,6],[577,3]]" :key="'b'+i" :x="b[0]" y="236" :width="b[1]" height="44" />
      </g>
      <rect x="392" y="288" width="90" height="7" rx="3.5" fill="var(--color-text-muted)" opacity="0.35" />
    </g>

    <!-- Сповіщення: phone + push banners -->
    <g v-else-if="name === 'notify'">
      <rect x="236" y="44" width="196" height="272" rx="26" stroke="var(--color-text-muted)" stroke-width="2" />
      <rect x="304" y="58" width="60" height="8" rx="4" fill="var(--color-text-muted)" opacity="0.5" />
      <rect x="140" y="92" width="310" height="66" rx="12" fill="var(--color-surface-2)" />
      <rect x="141" y="93" width="308" height="64" rx="12" stroke="var(--color-text-muted)" stroke-width="2" />
      <rect x="158" y="108" width="30" height="30" rx="8" stroke="var(--color-text-muted)" stroke-width="2" />
      <rect x="202" y="108" width="150" height="9" rx="4.5" fill="var(--color-text)" opacity="0.8" />
      <rect x="202" y="126" width="196" height="9" rx="4.5" fill="var(--color-text-muted)" opacity="0.5" />
      <circle cx="450" cy="92" r="10" fill="var(--color-accent)" />
      <rect x="176" y="176" width="310" height="66" rx="12" stroke="var(--color-text-muted)" stroke-width="2" />
      <rect x="194" y="192" width="30" height="30" rx="8" stroke="var(--color-text-muted)" stroke-width="2" />
      <rect x="238" y="192" width="120" height="9" rx="4.5" fill="var(--color-text-muted)" opacity="0.6" />
      <circle cx="244" cy="222" r="5" fill="var(--color-accent)" /><path d="M249 222h56" stroke="var(--color-accent)" stroke-width="2" /><circle cx="310" cy="222" r="5" stroke="var(--color-accent)" stroke-width="2" /><path d="M315 222h56" stroke="var(--color-text-muted)" stroke-width="2" stroke-dasharray="3 5" opacity="0.6" /><circle cx="376" cy="222" r="5" stroke="var(--color-text-muted)" stroke-width="2" />
      <rect x="148" y="260" width="310" height="56" rx="12" stroke="var(--color-text-muted)" stroke-width="2" opacity="0.6" />
      <rect x="166" y="274" width="26" height="26" rx="7" stroke="var(--color-text-muted)" stroke-width="2" opacity="0.7" />
      <rect x="206" y="274" width="140" height="8" rx="4" fill="var(--color-text-muted)" opacity="0.45" />
      <rect x="206" y="290" width="90" height="8" rx="4" fill="var(--color-text-muted)" opacity="0.3" />
    </g>

    <!-- Аналітика: dashboard -->
    <g v-else>
      <path d="M84 52v252M84 304h496" stroke="var(--color-text-muted)" stroke-width="2" />
      <path d="M84 120h496M84 182h496M84 244h496" stroke="var(--color-text-muted)" stroke-width="2" stroke-dasharray="3 8" opacity="0.4" />
      <g v-for="(b, i) in [[112,232,72],[180,196,108],[248,214,90],[316,164,140],[384,188,116],[452,132,172]]" :key="i">
        <rect :x="b[0]" :y="b[1]" width="36" :height="b[2]" rx="4" stroke="var(--color-text-muted)" stroke-width="2" fill="var(--color-surface-2)" />
      </g>
      <path d="M112 246C200 232 260 208 334 172c74-36 132-62 212-78" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round" />
      <circle cx="214" cy="212" r="5" fill="var(--color-accent)" /><circle cx="360" cy="160" r="5" fill="var(--color-accent)" /><circle cx="546" cy="94" r="7" fill="var(--color-accent)" />
      <rect x="452" y="56" width="18" height="8" rx="4" fill="var(--color-accent)" /><rect x="478" y="56" width="54" height="8" rx="4" fill="var(--color-text-muted)" opacity="0.5" />
      <rect x="452" y="74" width="18" height="8" rx="4" fill="var(--color-text-muted)" /><rect x="478" y="74" width="70" height="8" rx="4" fill="var(--color-text-muted)" opacity="0.5" />
    </g>
  </svg>
</template>

<style lang="scss" scoped>
.layer-card {
  display: block;
  width: 100%;
  height: auto;
}
</style>
