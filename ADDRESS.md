# OPTIONAL Question: 🗺️ Address

There are a lot of places in our Angular application where we need to ask the user for a physical address such as this one:

_Example Address_

```javascript
123 Main St
New York, NY 18814
```

In order to add an address field to many parts of our application to minimize code duplication, you would:

- Build a reusable address form component
- Possibly use an API or library to help with address validation / autocomplete
- Properly organize address logic/formatting/validation
- Include tests, etc.

## We will use the address control like this

```javascript
export class AppComponent {

	mainForm = new FormGroup({
		accept: new FormControl(), // true; false;
		address: new FormControl()
 	})
    }
}


----app-component.html
<form [formGroup]="mainForm">
    <mat-checkbox [formControlName]="accept"></mat-checkbox>
    <app-address [formControlName]="address"></app-address>
</form>
```

## 🤔⁉️ Question

How will your component interact with parent form groups? How will it share data with them? Please include detailed information about this.

## 🫵 Write your answer here

### Solution to question

The above address component will need to interact with parent form groups by implementing the ControlValueAccessor interface and also registering itself in the angular form system, which enables it to be integrate into angulars reactive form system
the step to do this are listed below

- **Implementing ControValueAccessor**
- The addresscomponent implements ControlValueAccessor class that servers as a connector between angular forms and the adress componet
- All the required methos like write value , registeronchnage, setDisabledstate and registerontouched are all incorporated from the implemented class
- An internal `form group` is use to mange the adress fields
- the component emits the adress ina predefined format using an interface as a guide
- `formcontrol.setvalue` and `writevalue` is used to update the internal fields in the adress component
- when making cjnages from the child to parent componet, the `valuechanges` subscription ould trigger onchange callback to update the parent componet
- `formcontrolname` directive is used by the parent to bind to the adress component

## 🧐️ FAQs

### Do I have to write any code for the question above?

No need to write code. Just a detailed answer is all we're looking for.
