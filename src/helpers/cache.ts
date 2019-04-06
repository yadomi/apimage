import { join, sort, map, toPairs, compose } from "ramda"
import { Transformations } from "./query"

const toString = compose(
	join(","),
	map(join(":")),
	sort((a, b) => a[0].localeCompare(b[0])),
	// @ts-ignore
	toPairs
)

export const getCacheKey = (uuid: string, transformations: Transformations) => {
	return uuid + "_" + toString(transformations)
}
