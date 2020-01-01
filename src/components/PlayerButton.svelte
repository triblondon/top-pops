<style>
@keyframes glow {
	from { box-shadow: 0 0 0 0 red; }
	to { box-shadow: 0 0 5px 3px red; }
}
span {
	border: 1px solid black;
	display: inline-block;
	border-radius: 10%;
	background: white;
	padding: 0 0.3em;
	animation: 1s ease-in infinite alternate glow;
}
</style>

<span><slot></slot></span>
