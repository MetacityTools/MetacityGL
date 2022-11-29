
export abstract class RenderingPipeline {
    abstract runRendringLoop(): void
    abstract resize(width: number, height: number): void
}