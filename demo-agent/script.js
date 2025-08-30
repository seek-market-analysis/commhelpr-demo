// Put HTML markup (e.g., <a>) directly in this string:
const RENEW_LINK = '<a href="#">Renew my driver licence</a>';
const TEXT = `
Renew online via ${RENEW_LINK},
or visit a TMR Customer Service Centre (some QGAPs do renewals).
If you’re interstate/overseas, you can renew by mail.
`;

const thread = document.getElementById("thread");
const promptBox = document.getElementById("prompt");
const sendBtn = document.querySelector(".send");

let currentTimer = null;

function stopTyping() {
    if (currentTimer) {
        clearTimeout(currentTimer);
        currentTimer = null;
    }
    // remove any old cursors
    thread.querySelectorAll(".cursor").forEach((c) => c.remove());
}

/**
 * Stream text while handling HTML tags atomically.
 * We split TEXT into tokens: tags vs text.
 * - Tag tokens (like <a ...> or </a>) are inserted all at once (no raw "<" typing).
 * - Text tokens are streamed character by character.
 */
function typeInto(containerPre, htmlString) {
    // Ensure we have a cursor span placed at the end of the pre
    let cursor = containerPre.querySelector(".cursor");
    if (!cursor) {
        cursor = document.createElement("span");
        cursor.className = "cursor";
        cursor.textContent = "▍";
        containerPre.appendChild(cursor);
    }

    // Ensure there's a text node right before the cursor to stream into
    function ensureTextNode() {
        let tn = cursor.previousSibling;
        if (!tn || tn.nodeType !== Node.TEXT_NODE) {
            tn = document.createTextNode("");
            cursor.before(tn);
        }
        return tn;
    }

    // Split into tags vs text, e.g. ["Text ", "<a href='#'>", "link", "</a>", " more"]
    const tokens = htmlString.split(/(<[^>]+>)/g).filter(Boolean);

    let tIndex = 0;
    let charIndex = 0;
    let currentText = "";

    function step() {
        // Finished all tokens
        if (tIndex >= tokens.length) {
            currentTimer = null;
            return;
        }

        const tok = tokens[tIndex];

        if (tok.startsWith("<")) {
            // Insert the whole tag atomically right before the cursor
            cursor.insertAdjacentHTML("beforebegin", tok);
            tIndex += 1;
            charIndex = 0;
            // continue immediately to next token
            currentTimer = setTimeout(step, 0);
        } else {
            // Stream the text content character-by-character
            if (charIndex === 0) currentText = tok; // capture this text token
            if (charIndex < currentText.length) {
                const ch = currentText[charIndex++];
                const tn = ensureTextNode();
                tn.data += ch;

                const delay = ",.;!?".includes(ch) ? 120 : 28;
                currentTimer = setTimeout(step, delay);
            } else {
                // Done with this text token — move to the next token
                tIndex += 1;
                charIndex = 0;
                currentTimer = setTimeout(step, 0);
            }
        }
    }

    step();
}

function handleSend() {
    const text = promptBox.value.trim();
    if (!text) return;

    stopTyping();

    // 1) Append user bubble
    const userMsg = document.createElement("div");
    userMsg.className = "msg user";
    userMsg.textContent = text;
    thread.appendChild(userMsg);

    // 2) Clear composer
    promptBox.value = "";

    // 3) Append new assistant bubble below and stream into it
    const asst = document.createElement("div");
    asst.className = "msg assistant";

    const pre = document.createElement("pre");
    // pre will get a cursor injected by typeInto
    asst.appendChild(pre);
    thread.appendChild(asst);
    asst.scrollIntoView({ behavior: "smooth", block: "end" });

    typeInto(pre, TEXT);
}

// Enter anywhere (except Shift+Enter) submits
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
});

// Button click also submits (if you have the .send button)
if (sendBtn) {
    sendBtn.addEventListener("click", handleSend);
}
