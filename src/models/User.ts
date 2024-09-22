import Graph from "./Graph";

export default interface User {
  _id: string;
  email: string;
  tree: Pick<Graph, "nodes">;
}
