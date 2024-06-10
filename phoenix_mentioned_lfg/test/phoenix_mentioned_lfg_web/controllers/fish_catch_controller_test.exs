defmodule PhoenixMentionedLfgWeb.FishCatchControllerTest do
  use PhoenixMentionedLfgWeb.ConnCase

  import PhoenixMentionedLfg.FishCatchesFixtures

  alias PhoenixMentionedLfg.FishCatches.FishCatch

  @create_attrs %{
    length: "some length",
    species_name: "some species_name",
    weight: "some weight"
  }
  @update_attrs %{
    length: "some updated length",
    species_name: "some updated species_name",
    weight: "some updated weight"
  }
  @invalid_attrs %{length: nil, species_name: nil, weight: nil}

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all fish_catches", %{conn: conn} do
      conn = get(conn, ~p"/api/fish_catches")
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create fish_catch" do
    test "renders fish_catch when data is valid", %{conn: conn} do
      conn = post(conn, ~p"/api/fish_catches", fish_catch: @create_attrs)
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get(conn, ~p"/api/fish_catches/#{id}")

      assert %{
               "id" => ^id,
               "length" => "some length",
               "species_name" => "some species_name",
               "weight" => "some weight"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post(conn, ~p"/api/fish_catches", fish_catch: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update fish_catch" do
    setup [:create_fish_catch]

    test "renders fish_catch when data is valid", %{conn: conn, fish_catch: %FishCatch{id: id} = fish_catch} do
      conn = put(conn, ~p"/api/fish_catches/#{fish_catch}", fish_catch: @update_attrs)
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get(conn, ~p"/api/fish_catches/#{id}")

      assert %{
               "id" => ^id,
               "length" => "some updated length",
               "species_name" => "some updated species_name",
               "weight" => "some updated weight"
             } = json_response(conn, 200)["data"]
    end

    test "renders errors when data is invalid", %{conn: conn, fish_catch: fish_catch} do
      conn = put(conn, ~p"/api/fish_catches/#{fish_catch}", fish_catch: @invalid_attrs)
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete fish_catch" do
    setup [:create_fish_catch]

    test "deletes chosen fish_catch", %{conn: conn, fish_catch: fish_catch} do
      conn = delete(conn, ~p"/api/fish_catches/#{fish_catch}")
      assert response(conn, 204)

      assert_error_sent 404, fn ->
        get(conn, ~p"/api/fish_catches/#{fish_catch}")
      end
    end
  end

  defp create_fish_catch(_) do
    fish_catch = fish_catch_fixture()
    %{fish_catch: fish_catch}
  end
end
