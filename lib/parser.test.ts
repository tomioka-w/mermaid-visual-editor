import assert from 'node:assert'
import test from 'node:test'
import { parseMermaidFlowchart } from './parser.ts'

test('parse Japanese subgraph title, direction, and style', () => {
  const result = parseMermaidFlowchart(`flowchart LR
    a[ダイエット] --> b[摂取カロリーを減らす]
    subgraph 摂取カロリー
      direction LR
      b --> b1[食事回数を減らす]
    end
    style 摂取カロリー fill:#ccc`)

  assert.strictEqual(result.error, null)

  const subgraph = result.nodes.find((node) => node.data.isSubgraph)
  assert.ok(subgraph)
  assert.strictEqual(subgraph.data.label, '摂取カロリー')
  assert.strictEqual(subgraph.data.subgraphDirection, 'LR')
  assert.strictEqual(subgraph.data.fillColor, '#ccc')

  const child = result.nodes.find((node) => node.id === 'b1')
  assert.strictEqual(child?.parentId, subgraph.id)

  const previouslyDeclaredChild = result.nodes.find((node) => node.id === 'b')
  assert.strictEqual(previouslyDeclaredChild?.parentId, subgraph.id)
})
