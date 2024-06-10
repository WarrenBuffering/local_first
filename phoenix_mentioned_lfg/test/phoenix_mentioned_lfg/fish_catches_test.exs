defmodule PhoenixMentionedLfg.FishCatchesTest do
  use PhoenixMentionedLfg.DataCase

  alias PhoenixMentionedLfg.FishCatches

  describe "fish_catches" do
    alias PhoenixMentionedLfg.FishCatches.FishCatch

    import PhoenixMentionedLfg.FishCatchesFixtures

    @invalid_attrs %{length: nil, species_name: nil, weight: nil}

    test "list_fish_catches/0 returns all fish_catches" do
      fish_catch = fish_catch_fixture()
      assert FishCatches.list_fish_catches() == [fish_catch]
    end

    test "get_fish_catch!/1 returns the fish_catch with given id" do
      fish_catch = fish_catch_fixture()
      assert FishCatches.get_fish_catch!(fish_catch.id) == fish_catch
    end

    test "create_fish_catch/1 with valid data creates a fish_catch" do
      valid_attrs = %{length: "some length", species_name: "some species_name", weight: "some weight"}

      assert {:ok, %FishCatch{} = fish_catch} = FishCatches.create_fish_catch(valid_attrs)
      assert fish_catch.length == "some length"
      assert fish_catch.species_name == "some species_name"
      assert fish_catch.weight == "some weight"
    end

    test "create_fish_catch/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = FishCatches.create_fish_catch(@invalid_attrs)
    end

    test "update_fish_catch/2 with valid data updates the fish_catch" do
      fish_catch = fish_catch_fixture()
      update_attrs = %{length: "some updated length", species_name: "some updated species_name", weight: "some updated weight"}

      assert {:ok, %FishCatch{} = fish_catch} = FishCatches.update_fish_catch(fish_catch, update_attrs)
      assert fish_catch.length == "some updated length"
      assert fish_catch.species_name == "some updated species_name"
      assert fish_catch.weight == "some updated weight"
    end

    test "update_fish_catch/2 with invalid data returns error changeset" do
      fish_catch = fish_catch_fixture()
      assert {:error, %Ecto.Changeset{}} = FishCatches.update_fish_catch(fish_catch, @invalid_attrs)
      assert fish_catch == FishCatches.get_fish_catch!(fish_catch.id)
    end

    test "delete_fish_catch/1 deletes the fish_catch" do
      fish_catch = fish_catch_fixture()
      assert {:ok, %FishCatch{}} = FishCatches.delete_fish_catch(fish_catch)
      assert_raise Ecto.NoResultsError, fn -> FishCatches.get_fish_catch!(fish_catch.id) end
    end

    test "change_fish_catch/1 returns a fish_catch changeset" do
      fish_catch = fish_catch_fixture()
      assert %Ecto.Changeset{} = FishCatches.change_fish_catch(fish_catch)
    end
  end
end
