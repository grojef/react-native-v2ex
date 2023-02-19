/**
 * Created by leon<silenceace@gmail.com> on 22/3/20.
 */
import { store } from '@src/store'
import { AppObject } from '@src/types'

/**
 * home tab nodes
 */
export interface TabNodeProps {
  title: string
  parentNodeNames: any[]
  children?: AppObject.Node[]
}

export let TabNodes: TabNodeProps[] = [
  { title: 'Life', parentNodeNames: ['life'] },
  { title: 'Geek', parentNodeNames: ['geek'] },
  { title: 'V2EX', parentNodeNames: ['v2ex'] }
]

export const nodeChildren = (rootNode: TabNodeProps, nodeData?: AppObject.Node[]): AppObject.Node[] => {
  const { title, parentNodeNames: parentNodes } = rootNode

  let nodes: AppObject.Node[] = []

  const all_node = nodeData ?? store.getState().app.allNode
  if (!all_node) return nodes

  return all_node.filter((v) => parentNodes.includes(v.dictLabel))
}
