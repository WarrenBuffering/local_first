defmodule PhoenixMentionedLfg.Repo.Migrations.CreateFishCatches do
  use Ecto.Migration

  def change do
    create table(:fish_catches) do
      add :species_name, :string
      add :length, :string
      add :weight, :string

      timestamps(type: :utc_datetime)
    end
  end
end
