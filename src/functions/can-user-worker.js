export const canUseWorker = () => typeof window !== 'undefined' && Boolean(window.Worker)
