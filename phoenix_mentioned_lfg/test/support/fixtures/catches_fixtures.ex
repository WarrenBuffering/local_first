defmodule PhoenixMentionedLfg.CatchesFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `PhoenixMentionedLfg.Catches` context.
  """

  @doc """
  Generate a catch.
  """
  def catch_fixture(attrs \\ %{}) do
    {:ok, catch} =
      attrs
      |> Enum.into(%{
        length: 42,
        species: "some species",
        weight: 42
      })
      |> PhoenixMentionedLfg.Catches.create_catch()

    catch
  end
end
