import { Box } from '@tldraw/editor'
import { addRoundedRectPath } from './addRoundedRectPath'

function createMockPath() {
	const calls: string[] = []
	const path = {
		arcTo: (...args: number[]) => calls.push(`arcTo(${args.join(',')})`),
		closePath: () => calls.push('closePath'),
		lineTo: (...args: number[]) => calls.push(`lineTo(${args.join(',')})`),
		moveTo: (...args: number[]) => calls.push(`moveTo(${args.join(',')})`),
		rect: (...args: number[]) => calls.push(`rect(${args.join(',')})`),
	}
	return { calls, path: path as unknown as Path2D }
}

describe('addRoundedRectPath', () => {
	it('adds a plain rectangle when the radius is zero', () => {
		const { calls, path } = createMockPath()
		addRoundedRectPath(path, new Box(10, 20, 100, 50), 0)
		expect(calls).toEqual(['rect(10,20,100,50)'])
	})

	it('clamps the radius to half the smaller side and draws clockwise by default', () => {
		const { calls, path } = createMockPath()
		addRoundedRectPath(path, new Box(0, 0, 100, 50), 100)
		// clamped radius is 25: starts at (x + r, y), uses four arcTo corners, closes
		expect(calls[0]).toBe('moveTo(25,0)')
		expect(calls.filter((c) => c.startsWith('arcTo'))).toHaveLength(4)
		expect(calls[calls.length - 1]).toBe('closePath')
	})

	it('draws counter-clockwise when asked, for clip-path cutouts', () => {
		const { calls, path } = createMockPath()
		addRoundedRectPath(path, new Box(0, 0, 100, 50), 10, true)
		expect(calls[0]).toBe('moveTo(0,10)')
		expect(calls.filter((c) => c.startsWith('arcTo'))).toHaveLength(4)
		expect(calls[calls.length - 1]).toBe('closePath')
	})
})
