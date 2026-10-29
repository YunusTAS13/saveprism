// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    // `saveprism-desktop.exe mcp` is the MCP server on stdio and never opens a window.
    if std::env::args_os()
        .nth(1)
        .is_some_and(|argument| argument.as_os_str() == std::ffi::OsStr::new("mcp"))
    {
        std::process::exit(saveprism_desktop_lib::mcp::run_stdio());
    }
    #[cfg(target_os = "linux")]
    disable_webkit_dmabuf();
    saveprism_desktop_lib::run()
}

/// WebKitGTK's DMABUF renderer shows only a white window on many Linux setups (some GPU
/// drivers, virtual machines). Turn it off unless the user has set the variable themselves.
#[cfg(target_os = "linux")]
#[allow(unsafe_code)]
fn disable_webkit_dmabuf() {
    const KEY: &str = "WEBKIT_DISABLE_DMABUF_RENDERER";
    if std::env::var_os(KEY).is_none() {
        // SAFETY: runs at the start of `main`, before the app starts any other thread.
        unsafe { std::env::set_var(KEY, "1") };
    }
}
