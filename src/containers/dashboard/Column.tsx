import Image from 'next/image';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import Card from './Card';

import useModal from '@/hooks/useModal';
import { Card as CardType } from '@/types/Card.interface';
import { Column as ColumnType } from '@/types/Column.interface';

interface ColumnProps {
  column: ColumnType;
  columns: ColumnType[];
  index: number;
  cards: CardType[];
}

function Column({ column, index, cards, columns }: ColumnProps) {
  const { openModifyColumnModal, openEditCardModal, openTodoCardModal } = useModal();

  return (
    <div className='block lg:flex'>
      <div className='flex flex-col bg-gray-fa p-5 transition-colors lg:w-[354px] dark:bg-dark-bg'>
        {/* Column Header */}
        <div className='mb-[6px] flex cursor-default items-center justify-between'>
          <div className='flex items-center'>
            <span className='mr-[8px] text-xs text-violet'>𒊹</span>
            <h2 className='mr-[12px] text-lg font-bold text-black-33 dark:text-dark-10'>{column.title}</h2>
            <span className='flex size-[20px] items-center justify-center rounded-[6px] bg-gray-ee text-xs text-gray-78 dark:bg-dark-200 dark:text-dark-10'>
              {cards.length}
            </span>
          </div>
          {/* Column Edit Button */}
          <button
            className='transition duration-300 ease-in-out hover:rotate-90'
            onClick={() => {
              openModifyColumnModal({ columns, columnId: column.id, columnTitle: column.title });
            }}
          >
            <Image src='/icons/gear.svg' width={24} height={24} alt='톱니바퀴 아이콘' />
          </button>
        </div>

        {/* Add Card Button */}
        <button
          className='btn-violet-light dark:btn-violet-dark mb-[16px] h-[40px] rounded-[6px] border'
          onClick={() => {
            openEditCardModal({ columnId: column.id, isEdit: false });
          }}
        >
          <Image src='/icons/plus-filled.svg' width={22} height={22} alt='카드 추가 아이콘' className='dark:hidden' />
          <Image src='/icons/plus.svg' width={24} height={24} alt='카드 추가 아이콘' className='hidden dark:block' />
        </button>

        {/* Card List Section */}
        <div className='scrollbar-hide lg:h-[700px] lg:overflow-y-auto'>
          <Droppable droppableId={`column-${column.id}`} key={`column-${column.id}`}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {cards.map((card, index) => (
                  <Draggable key={`card-${card.id}`} draggableId={`card-${card.id}`} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => {
                          openTodoCardModal({
                            card,
                            column,
                          });
                        }}
                      >
                        <Card key={`card-${card.id}`} card={card} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>

      {/* Horizon Bar */}
      <hr className='h-full border-l border-gray-d9 dark:border-dark-200' />
    </div>
  );
}

export default Column;
