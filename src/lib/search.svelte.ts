// Whether the search dialog is open. Any trigger on any page calls show().
class SearchState {
	open = $state(false);
	show = () => (this.open = true);
	hide = () => (this.open = false);
}

export const search = new SearchState();
