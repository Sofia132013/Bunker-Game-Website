import { createLobby } from "../../services/LobbyService";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLobbySchema } from "../../schemas/LobbySchemas";
import type { CreateLobbyFormData } from "../../schemas/LobbySchemas";

const CreateLobbyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLobbyFormData>({
    resolver: zodResolver(createLobbySchema),
    defaultValues: {
      hostName: "Соня",
      roomName: "Клубничная комната",
      maxPlayers: "8",
      apocalypseType: "Чикавики",
    },
  });
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: createLobby,
    onSuccess: (response) => {
        navigate(`/lobby/${response.lobbyid}`);
        console.log(response);
    },
    onError: (error) => console.log(`an error occured ${error}`),
  });

  const onSubmit: SubmitHandler<CreateLobbyFormData> = (data) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Имя хоста
        <input type="text" {...register("hostName")} />
      </label>
      {errors.hostName && <p>{errors.hostName.message}</p>}
      <label>
        Название комнаты
        <input type="text" {...register("roomName")} />
      </label>
      {errors.roomName && <p>{errors.roomName.message}</p>}

      <label>
        Чикавики
        <input type="radio" value="Чикавики" {...register("apocalypseType")} />
      </label>
      <label>
        Зомбэ
        <input type="radio" value="Зомбэ" {...register("apocalypseType")} />
      </label>
      <label>
        Бебэбе
        <input type="radio" value="бебэбе" {...register("apocalypseType")} />
      </label>

      <label>
        Пррьи
        <input type="radio" value="пррьи" {...register("apocalypseType")} />
      </label>

      <label>
         Максимальное количество игроков
        <input type="range" min="5" max="10" {...register("maxPlayers")} />
      </label>

      <button type="submit">Move on</button>
    </form>
  );
};

export default CreateLobbyForm;
