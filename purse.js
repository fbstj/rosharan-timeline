/// # purse.js
console.debug('# purse.js')
// needs: user-file-buttons.js

/// a wrapper around accessing localStorage
class Purse {
	/// create the wrapper to access the localStorage key @name
	constructor(name) {
		this.name = name
		this.data = null
		this.load(true)
	}
	
	/// load JSON object into this.store
	load(force = false) {
		if (force || this.dirty) {
			this.data = JSON.parse(localStorage.getItem(this.name))
			this.dirty = false
		}
	}
	/// persist this.store
	save(force = false) {
		if (force || this.dirty) {
			localStorage.setItem(this.name, JSON.stringify(this.data))
		}
		this.load()
	}
}
