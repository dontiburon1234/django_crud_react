import { useForm } from 'react-hook-form';
import { creareTask, deleteTask, updateTask, getTask } from '../api/tasks.api';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast'

export function TaskFormPage() {

  const { register, handleSubmit, 
    formState: { errors },
    setValue
  } = useForm()

  const navigate = useNavigate();
  const params = useParams();

  const onSubmit = handleSubmit(async data => {
    if (params.id){
      await updateTask(params.id, data)
      toast.success('Task update. ', {
        position: "bottom-right",
        style: {
          background: "#3FB238",
          color: "#fff"
        }
      })
    } else {
      const res = await creareTask(data)
      toast.success('Was created. ', {
        position: "bottom-right",
        style: {
          background: "#3F5DB5",
          color: "#fff"
        }
      })
    }    
    navigate('/tasks')
  })

  useEffect(() => {
    async function loadTask(id){
      if (params.id){
        // const res = await getTask(id)
        // const { data } = await getTask(id)
        const { data: {title, description} } = await getTask(id)
        setValue('title', title)
        setValue('description', description)
      }
    }
    loadTask(params.id)
  }, [])

  return (
    <div className='max-w-xl mx-auto'>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="Title" {...register("title", {required: true})} 
        className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'/>
        {errors.title && <span>this field title is required</span>}

        <textarea row="3" placeholder="Description" {...register("description", {required: true})}
        className='bg-zinc-700 p-3 rounded-lg block w-full mb-3'
        ></textarea>
        {errors.description && <span>this field description is required</span>}
        <label>
          <input type="checkbox" id="cbox1" value="first_checkbox" />Done
        </label> 
        <button className='bg-indigo-500 p-3 rounded-lg block w-full mt-3'>Save</button>
      </form>
      { params.id && (
        <div className='flex justify-end'>
          <button
        onClick={async () => {
          const accepted = window.confirm("Are you sure?");
          if(accepted){
            await deleteTask(params.id);
            toast.success('Task deleted. ', {
              position: "bottom-right",
              style: {
                background: "#CB2938",
                color: "#fff"
              }
            });
            navigate("/tasks");
          }
        }}
        className='bg-red-500 p-3 rounded-lg w-48 mt-3'
      >Delete</button>
        </div>
       )}
      
    </div>
  )
}
