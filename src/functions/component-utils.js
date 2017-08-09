export const isES6Component = c => c.prototype.mixins === undefined

export const isFunctionalComponent = c => !c.prototype.render
