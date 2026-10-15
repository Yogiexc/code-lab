defmodule GitBadge.MixProject do
  use Mix.Project

  def project do
    [
      app: :gitbadge_core,
      version: "0.1.0",
      elixir: "~> 1.14",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      description: "Concurrent GitHub Achievement Queue & Pipeline Orchestrator in Elixir"
    ]
  end

  def application do
    [
      extra_applications: [:logger]
    ]
  end

  defp deps do
    []
  end
end
