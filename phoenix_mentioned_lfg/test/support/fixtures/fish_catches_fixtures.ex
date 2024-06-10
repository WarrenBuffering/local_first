defmodule PhoenixMentionedLfg.FishCatchesFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `PhoenixMentionedLfg.FishCatches` context.
  """

  @doc """
  Generate a fish_catch.
  """
  def fish_catch_fixture(attrs \\ %{}) do
    {:ok, fish_catch} =
      attrs
      |> Enum.into(%{
        length: "some length",
        species_name: "some species_name",
        weight: "some weight"
      })
      |> PhoenixMentionedLfg.FishCatches.create_fish_catch()

    fish_catch
  end
end
