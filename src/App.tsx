import { useState } from "react";
import "./App.css";
import { useFieldArray, useForm, SubmitHandler } from "react-hook-form";
import * as Services from "./services";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";

type Question = {
  title: string;
  content: string;
  index: string;
};

function App() {
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      questions: Services.get() as Question[],
    },
  });
  const { fields, append, move, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const dndSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  return (
    <div>
      <form
        onSubmit={handleSubmit((data) => {
          Services.save(
            data.questions.map((item, index) => ({ ...item, index }))
          );
        })}
      >
        <div>
          <button
            type="button"
            onClick={() => {
              append({
                content: "",
                title: "",
                index: (fields.length + 1).toString(),
              });
            }}
          >
            Adicionar nova pergunta
          </button>
          <button type="submit">Salvar</button>
        </div>

        <DndContext
          onDragEnd={(event) => {
            const { active, over } = event;

            if (!over) return;
            if (active.id === over.id) return;

            const oldIndex = fields
              .map((i) => i.id)
              .indexOf(active.id.toString());
            const newIndex = fields
              .map((i) => i.id)
              .indexOf(over.id.toString());

            move(oldIndex, newIndex);
          }}
          collisionDetection={closestCenter}
          sensors={dndSensors}
        >
          <SortableContext
            items={fields}
            strategy={verticalListSortingStrategy}
          >
            <div>
              {fields.map((question, index) => {
                return (
                  <SortableItem key={question.id} id={question.id}>
                    <div key={question.id} className="form-item">
                      <label htmlFor="">
                        <span>
                          Título <b>#{index}</b>
                        </span>
                        <textarea {...register(`questions.${index}.title`)} />
                      </label>

                      <label htmlFor="">
                        <span>Conteúdo</span>
                        <textarea {...register(`questions.${index}.content`)} />
                      </label>

                      <button
                        onClick={() => {
                          remove(index);
                        }}
                      >
                        X
                      </button>
                    </div>
                  </SortableItem>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      </form>
    </div>
  );
}

export default App;
