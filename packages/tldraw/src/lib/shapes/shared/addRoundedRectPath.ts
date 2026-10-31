import { Box } from '@tldraw/editor'

/**
 * Append a rounded-rectangle subpath to a Path2D object.
 *
 * The radius is clamped to half the bounds' width and height, so it can never
 * exceed the rectangle itself. When the radius is zero, a plain rectangle is
 * added instead. Pass `counterClockwise` when the subpath should cut a hole
 * out of a clip path rather than draw a shape.
 *
 * @public
 */
export function addRoundedRectPath(
	path: Path2D,
	bounds: Box,
	radius: number,
	counterClockwise = false
) {
	const r = Math.max(0, Math.min(radius, bounds.w / 2, bounds.h / 2))

	if (r === 0) {
		path.rect(bounds.x, bounds.y, bounds.w, bounds.h)
		return
	}

	if (counterClockwise) {
		path.moveTo(bounds.x, bounds.y + r)
		path.lineTo(bounds.x, bounds.maxY - r)
		path.arcTo(bounds.x, bounds.maxY, bounds.x + r, bounds.maxY, r)
		path.lineTo(bounds.maxX - r, bounds.maxY)
		path.arcTo(bounds.maxX, bounds.maxY, bounds.maxX, bounds.maxY - r, r)
		path.lineTo(bounds.maxX, bounds.y + r)
		path.arcTo(bounds.maxX, bounds.y, bounds.maxX - r, bounds.y, r)
		path.lineTo(bounds.x + r, bounds.y)
		path.arcTo(bounds.x, bounds.y, bounds.x, bounds.y + r, r)
		path.closePath()
		return
	}

	path.moveTo(bounds.x + r, bounds.y)
	path.lineTo(bounds.maxX - r, bounds.y)
	path.arcTo(bounds.maxX, bounds.y, bounds.maxX, bounds.y + r, r)
	path.lineTo(bounds.maxX, bounds.maxY - r)
	path.arcTo(bounds.maxX, bounds.maxY, bounds.maxX - r, bounds.maxY, r)
	path.lineTo(bounds.x + r, bounds.maxY)
	path.arcTo(bounds.x, bounds.maxY, bounds.x, bounds.maxY - r, r)
	path.lineTo(bounds.x, bounds.y + r)
	path.arcTo(bounds.x, bounds.y, bounds.x + r, bounds.y, r)
	path.closePath()
}
