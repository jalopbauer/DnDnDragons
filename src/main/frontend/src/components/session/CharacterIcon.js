import { useDrag } from 'react-dnd';

const CharacterIcon = () => {
  const [{isDragging, item}, drag] = useDrag(() => ({
    type: "icon",
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
      item: monitor.getItem(),
    }),
  }))

  return (
    <div
      className="CharacterIcon"
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        fontSize: 100,
        fontWeight: 'bold',
        cursor: 'move',
      }}
    >
      ♘
    </div>
  );
}

export default CharacterIcon;