defmodule PhoenixMentionedLfgWeb.Router do
  use PhoenixMentionedLfgWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {PhoenixMentionedLfgWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", PhoenixMentionedLfgWeb do
    pipe_through :browser

    get "/", PageController, :home
  end

  # Other scopes may use custom stacks.
  scope "/api", PhoenixMentionedLfgWeb do
    pipe_through :api

    get "/fish_catches", FishCatchController, :index
    get "/fish_catches/:id", FishCatchController, :show
    post "/fish_catches", FishCatchController, :create
    post "/fish_catches/bulk_create", FishCatchController, :create_many
    delete "/fish_catches/:id", FishCatchController, :delete
    delete "/fish_catches/bulk_delete", FishCatchController, :delete_many
  end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:phoenix_mentioned_lfg, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: PhoenixMentionedLfgWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end
end
