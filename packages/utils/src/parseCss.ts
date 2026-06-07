import fs from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';
import postcssSelectorParser, {
  type Selector,
  type SyncProcessor,
} from 'postcss-selector-parser';

const exampleCss = fs.readFileSync(
  path.resolve(import.meta.dirname, 'example.css'),
  'utf8',
);

const processor = postcss();

const selectorNodes: Selector[] = [];

const selectorTransform: SyncProcessor = (selector) => {
  for (const node of selector.nodes) {
    selectorNodes.push(node);
  }
};
const selectorParser = postcssSelectorParser(selectorTransform);

const res = processor.process(exampleCss);
const { root } = res;

for (const node of root.nodes) {
  if (node.type !== 'rule') continue;

  selectorParser.processSync(node.selector);

  for (const childNode of node.nodes) {
    if (childNode.type !== 'decl') continue;

    console.log(childNode.prop);
    console.log(childNode.value);
  }
}

console.log(selectorNodes);
