defmodule PhoenixMentionedLfg.FishCatches do
  @moduledoc """
  The FishCatches context.
  """

  import Ecto.Query, warn: false
  alias PhoenixMentionedLfg.Repo

  alias PhoenixMentionedLfg.FishCatches.FishCatch

  @doc """
  Returns the list of fish_catches.

  ## Examples

      iex> list_fish_catches()
      [%FishCatch{}, ...]

  """
  def list_fish_catches do
    Repo.all(FishCatch)
  end

  @doc """
  Gets a single fish_catch.

  Raises `Ecto.NoResultsError` if the Fish catch does not exist.

  ## Examples

      iex> get_fish_catch!(123)
      %FishCatch{}

      iex> get_fish_catch!(456)
      ** (Ecto.NoResultsError)

  """
  def get_fish_catch!(id), do: Repo.get!(FishCatch, id)

  @doc """
  Creates a fish_catch.

  ## Examples

      iex> create_fish_catch(%{field: value})
      {:ok, %FishCatch{}}

      iex> create_fish_catch(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_fish_catch(attrs \\ %{}) do
    %FishCatch{}
    |> FishCatch.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a fish_catch.

  ## Examples

      iex> update_fish_catch(fish_catch, %{field: new_value})
      {:ok, %FishCatch{}}

      iex> update_fish_catch(fish_catch, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_fish_catch(%FishCatch{} = fish_catch, attrs) do
    fish_catch
    |> FishCatch.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a fish_catch.

  ## Examples

      iex> delete_fish_catch(fish_catch)
      {:ok, %FishCatch{}}

      iex> delete_fish_catch(fish_catch)
      {:error, %Ecto.Changeset{}}

  """
  def delete_fish_catch(%FishCatch{} = fish_catch) do
    Repo.delete(fish_catch)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking fish_catch changes.

  ## Examples

      iex> change_fish_catch(fish_catch)
      %Ecto.Changeset{data: %FishCatch{}}

  """
  def change_fish_catch(%FishCatch{} = fish_catch, attrs \\ %{}) do
    FishCatch.changeset(fish_catch, attrs)
  end
end
