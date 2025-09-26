import { useState } from "react";
import { List, ListItem } from "@mui/material";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactElement} from "react";

interface ListProps {
  children: Array<ReactElement>;
}

// Sortable wrapper
const SortableItem = ({ id, children }: { id: string; children: ReactElement }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: "8px",
  };

  return (
    <ListItem ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </ListItem>
  );
};

export default function DraggableList({ children }: ListProps) {
  // Assign unique IDs to each child based on index
  const [items, setItems] = useState(
    children.map((child, index) => ({ id: `item-${index}`, child }))
  );

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      setItems((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((i) => { console.log(i)
        
        return i.id})} strategy={verticalListSortingStrategy}>
        <List sx={{ width: 300 }}>
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id}>
              {item.child}
            </SortableItem>
          ))}
        </List>
      </SortableContext>
    </DndContext>
  );
}