defmodule PhoenixMentionedLfgWeb.FishCatchJSON do
  alias PhoenixMentionedLfg.FishCatches.FishCatch

  @doc """
  Renders a list of fish_catches.
  """
  def index(%{fish_catches: fish_catches}) do
    %{data: for(fish_catch <- fish_catches, do: data(fish_catch))}
  end

  @doc """
  Renders a single fish_catch.
  """
  def show(%{fish_catch: fish_catch}) do
    %{data: data(fish_catch)}
  end

  @doc """
  Renders the result of creating many fish_catches.
  """
  def create_many(%{ok_results: ok_results, error_results: error_results}) do
    %{
      ok: for({:ok, fish_catch} <- ok_results, do: data(fish_catch)),
      errors: for({:error, error_attrs} <- error_results, do: error_attrs)
    }
  end

  @doc """
  Renders the result of deleting many fish_catches.
  """
  def delete_many(%{ok_results: ok_results, error_results: error_results}) do
    %{
      ok: for({:ok, fish_catch} <- ok_results, do: data(fish_catch)),
      errors: for({:error, %{id: id, reason: reason}} <- error_results, do: %{id: id, error: reason})
    }
  end

  defp data(%FishCatch{} = fish_catch) do
    %{
      id: fish_catch.id,
      species_name: fish_catch.species_name,
      length: fish_catch.length,
      weight: fish_catch.weight
    }
  end
end

