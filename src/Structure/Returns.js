class Returns {
	constructor() {
		this.overall = true
		this.returns = Object()
		this.errors = []
	}
	pushErr(obj) {
		this.errors.push(obj)
		this.overall = false
	}
}
export default Returns