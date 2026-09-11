package com.gita.wisdom;

import android.content.res.Configuration;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import androidx.core.view.ViewCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().getSettings().setMediaPlaybackRequiresUserGesture(false);
            getBridge().getWebView().setOverScrollMode(View.OVER_SCROLL_NEVER);
        }
        applySystemBarsTheme();
    }

    @Override
    public void onResume() {
        super.onResume();
        applySystemBarsTheme();
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().getSettings().setMediaPlaybackRequiresUserGesture(false);
            getBridge().getWebView().setOverScrollMode(View.OVER_SCROLL_NEVER);
            ViewCompat.requestApplyInsets(getBridge().getWebView());
        }
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        applySystemBarsTheme();
    }

    private void applySystemBarsTheme() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            int nightModeFlags = getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
            boolean isNight = nightModeFlags == Configuration.UI_MODE_NIGHT_YES;

            int navColor = isNight ? Color.parseColor("#141210") : Color.parseColor("#F6F1EA");
            int statusColor = isNight ? Color.parseColor("#141210") : Color.parseColor("#F6F1EA");

            getWindow().setNavigationBarColor(navColor);
            getWindow().setStatusBarColor(statusColor);

            View decorView = getWindow().getDecorView();
            int flags = decorView.getSystemUiVisibility();

            if (!isNight) {
                flags |= View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    flags |= View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
                }
            } else {
                flags &= ~View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    flags &= ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
                }
            }
            decorView.setSystemUiVisibility(flags);
        }
    }
}
