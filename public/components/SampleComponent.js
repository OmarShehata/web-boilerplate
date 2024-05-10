const style = 
`<style>
@import "/components/SampleComponent.css";
</style>
`
/*
To use this element:

1. Import it

<script type="module" src="/components/SampleComponent.js"></script>

2. Use it

<sample-component></sample-component>
*/

const elementName = 'sample-component'
class SampleComponent extends HTMLElement {
	constructor() {
		super()

		const shadow = this.attachShadow({mode: 'open'});
		let inputElement = document.createElement('div')
		inputElement.innerHTML = 
		`	
		<form method='post' action="addNumberForm">
			<p>Choose a random number:</p>
			<input name="rand-num" id="rand-num" style="margin:5px"></input>
		  <input id="submitBtn" type='submit' value='submit' />
	  </form>  
		
		`
		shadow.appendChild(inputElement)


	    const element = document.createElement('button')
	    element.id = "new-button"
	    element.innerHTML = 
	    `${style}
	    ➕ Submit random number JSON`
		shadow.appendChild(element)

		const logElementId = this.getAttribute("log-element-id")

		this.shadow = shadow
		this.logElement = document.querySelector(`#${logElementId}`)
	}

	connectedCallback() {
		const newButton = this.shadow.querySelector("#new-button")
		newButton.onclick = async (e) => {
			this.logElement.innerText = "Submitting..."
			const result = await this.submitToDB()
			console.log({ result })
		}
	}

	async submitToDB() {
		// const value = this.shadow.querySelector("#rand-num").value
		const value = Math.round(Math.random() * 10)
		const { logElement } = this
		try {
			const response = await fetch("/addNumber", {
			  method: "POST",
			  body: JSON.stringify({ 
			  	number: value
			  }),
			  headers: {
			    "Content-type": "application/json; charset=UTF-8"
			  }
			})

			if (response.status != 200) {
				logElement.innerText = `Failed to create new rule: status code ${response.status}`
				return
			}

			const parsedResponse = await response.json()
			this.logElement.innerText = 'done!'
			return parsedResponse
		} catch (e) {
			logElement.innerText = `Failed to create new rule: ${e}`
		}
	}
}

window.customElements.define(elementName, SampleComponent);
