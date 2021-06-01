function isSSR() {
	return typeof globalThis.window?.document?.createElement === 'undefined';
}

function isBrowser() {
	return !isSSR();
}

export { isSSR, isBrowser };
