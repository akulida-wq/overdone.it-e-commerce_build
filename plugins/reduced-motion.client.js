// Sets the global prefers-reduced-motion flag BEFORE the app mounts, so any
// component can read it synchronously in its own onMounted (app.vue's init
// runs after children mount and would be too late).
export default defineNuxtPlugin(() => {
  const reduced = useState('od-reduced-motion', () => false)
  reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // the head inline script decides before first paint whether the session
  // preloader runs; mirror that into state so components (hero intro) can wait
  const preloading = useState('od-preloader-active', () => false)
  preloading.value = document.documentElement.classList.contains('od-preload')
})
