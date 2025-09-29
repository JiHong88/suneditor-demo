import { fetchGitHubStars } from "@/lib/git/stars";

export async function GitHubStars() {
    const stars = await fetchGitHubStars();

    return (
        <div className="text-center py-4">
            <p className="font-bold text-2xl">{stars.toLocaleString()} Stars on GitHub!</p>
        </div>
    );
}