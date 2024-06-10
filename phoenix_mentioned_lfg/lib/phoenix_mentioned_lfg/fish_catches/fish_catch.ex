defmodule PhoenixMentionedLfg.FishCatches.FishCatch do
  use Ecto.Schema
  import Ecto.Changeset

  schema "fish_catches" do
    field :length, :string
    field :species_name, :string
    field :weight, :string

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(fish_catch, attrs) do
    fish_catch
    |> cast(attrs, [:species_name, :length, :weight])
    |> validate_required([:species_name, :length, :weight])
  end
end
