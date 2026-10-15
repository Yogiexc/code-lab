defmodule GitBadge.Orchestrator do
  @moduledoc """
  Sistem terdistribusi berbasis BEAM VM untuk memproses antrean verifikasi
  dan pemantauan status pencapaian medali GitHub (Pair Extraordinaire, Pull Shark, Galaxy Brain).
  """

  @doc """
  Memvalidasi apakah trailer commit mematuhi standar Co-Authored-By GitHub.
  """
  def validate_coauthor_trailer(trailer) when is_binary(trailer) do
    regex = ~r/^Co-authored-by:\s+(?<name>[^<]+)\s+<(?<email>[^>]+)>$/i

    case Regex.named_captures(regex, String.trim(trailer)) do
      %{"name" => name, "email" => email} ->
        {:ok, %{name: String.trim(name), email: String.trim(email), valid: true}}

      _ ->
        {:error, :invalid_trailer_format}
    end
  end

  @doc """
  Menghitung estimasi waktu sinkronisasi antrean GitHub cronjob (batch delay).
  """
  def estimate_sync_window(badge_type) do
    case badge_type do
      :quickdraw -> {:ok, "1 - 5 Menit (Event-triggered)"}
      :pull_shark -> {:ok, "5 - 15 Menit (Webhook-triggered)"}
      :galaxy_brain -> {:ok, "5 - 15 Menit (Discussions-indexed)"}
      :pair_extraordinaire -> {:ok, "24 - 48 Jam (Batch User Account Cross-reference)"}
      _ -> {:error, :unknown_badge}
    end
  end
end
