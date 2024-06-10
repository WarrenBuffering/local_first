defmodule PhoenixMentionedLfgWeb.FishCatchController do
  use PhoenixMentionedLfgWeb, :controller

  alias PhoenixMentionedLfg.FishCatches
  alias PhoenixMentionedLfg.FishCatches.FishCatch
  alias PhoenixMentionedLfgWeb.ChangesetJSON

  action_fallback PhoenixMentionedLfgWeb.FallbackController

  def index(conn, _params) do
    fish_catches = FishCatches.list_fish_catches()
    render(conn, :index, fish_catches: fish_catches)
  end

  def create(conn, %{"fish_catch" => fish_catch_params}) do
    with {:ok, %FishCatch{} = fish_catch} <- FishCatches.create_fish_catch(fish_catch_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/fish_catches/#{fish_catch}")
      |> render(:show, fish_catch: fish_catch)
    end
  end

  def create_many(conn, %{"fish_catches" => fish_catch_params_list}) do
    results = Enum.map(fish_catch_params_list, fn attrs ->
      _id = Map.get(attrs, "id", nil)
      attrs_for_creation = Map.delete(attrs, "id")

      case FishCatches.create_fish_catch(attrs_for_creation) do
        {:ok, result} -> {:ok, result}
        {:error, changeset} -> 
          cleaned_attrs = clear_invalid_fields(attrs, changeset)
          {:error, Map.put(cleaned_attrs, :errors, ChangesetJSON.error(%{changeset: changeset}))}
      end
    end)

    {ok_results, error_results} = Enum.split_with(results, &match?({:ok, _}, &1))

    conn
    |> put_status(:multi_status)
    |> render("create_many.json", ok_results: Enum.map(ok_results, fn {:ok, result} -> result end), error_results: Enum.map(error_results, fn {:error, error} -> error end))
  end

  defp clear_invalid_fields(attrs, changeset) do
    invalid_fields = changeset.errors |> Keyword.keys()
    Enum.reduce(invalid_fields, attrs, fn field, acc ->
      Map.put(acc, field, "")
    end)
  end

  def show(conn, %{"id" => id}) do
    fish_catch = FishCatches.get_fish_catch!(id)
    render(conn, :show, fish_catch: fish_catch)
  end

  def update(conn, %{"id" => id, "fish_catch" => fish_catch_params}) do
    fish_catch = FishCatches.get_fish_catch!(id)

    with {:ok, %FishCatch{} = fish_catch} <- FishCatches.update_fish_catch(fish_catch, fish_catch_params) do
      render(conn, :show, fish_catch: fish_catch)
    end
  end

  def delete(conn, %{"id" => id}) do
    fish_catch = FishCatches.get_fish_catch!(id)

    with {:ok, %FishCatch{}} <- FishCatches.delete_fish_catch(fish_catch) do
      send_resp(conn, :no_content, "")
    end
  end

  def delete_many(conn, %{"ids" => ids}) do
    results = Enum.map(ids, fn id ->
      case FishCatches.delete_fish_catch(%FishCatch{id: id}) do
        {:ok, result} -> {:ok, result}
        {:error, reason} -> {:error, %{id: id, reason: reason}}
      end
    end)

    {ok_results, error_results} = Enum.split_with(results, &match?({:ok, _}, &1))

    conn
    |> put_status(:multi_status)
    |> render("delete_many.json", ok_results: Enum.map(ok_results, fn {:ok, result} -> result end), error_results: Enum.map(error_results, fn {:error, error} -> error end))
  end
end

