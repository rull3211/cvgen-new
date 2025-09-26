import DraggableList from "@/components/reroderableList/ReorderableComponent";

export default function Editor(){
    const liste = [1,2,3,]
    return <DraggableList>{liste.map(el => <div>{<DraggableList>{liste.map(eli=> <div>{eli}</div>)}</DraggableList>}</div>)}</DraggableList>
}