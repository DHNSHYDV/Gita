package com.gita.wisdom;

import android.app.Activity;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.view.View;
import android.webkit.JavascriptInterface;
import androidx.core.content.FileProvider;
import android.Manifest;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.view.ViewCompat;
import com.getcapacitor.BridgeActivity;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().getSettings().setMediaPlaybackRequiresUserGesture(false);
            getBridge().getWebView().setOverScrollMode(View.OVER_SCROLL_NEVER);
            getBridge().getWebView().addJavascriptInterface(new NativeShareBridge(this), "NativeShareBridge");
        }
        applySystemBarsTheme();
        checkAndRequestStorageAndNotifPermissions();
    }

    public void checkAndRequestStorageAndNotifPermissions() {
        List<String> perms = new ArrayList<>();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_MEDIA_IMAGES) != PackageManager.PERMISSION_GRANTED) {
                perms.add(Manifest.permission.READ_MEDIA_IMAGES);
            }
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                perms.add(Manifest.permission.POST_NOTIFICATIONS);
            }
        } else {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                perms.add(Manifest.permission.WRITE_EXTERNAL_STORAGE);
            }
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                perms.add(Manifest.permission.READ_EXTERNAL_STORAGE);
            }
        }
        if (!perms.isEmpty()) {
            ActivityCompat.requestPermissions(this, perms.toArray(new String[0]), 101);
        }
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

    public static class NativeShareBridge {
        private final Activity activity;

        public NativeShareBridge(Activity activity) {
            this.activity = activity;
        }

        @JavascriptInterface
        public boolean isAvailable() {
            return true;
        }

        @JavascriptInterface
        public void requestStoragePermissions() {
            activity.runOnUiThread(() -> {
                if (activity instanceof MainActivity) {
                    ((MainActivity) activity).checkAndRequestStorageAndNotifPermissions();
                }
            });
        }

        @JavascriptInterface
        public boolean shareToWhatsApp(String base64Image, String filename, String caption) {
            try {
                byte[] bytes = Base64.decode(base64Image, Base64.DEFAULT);
                File cachePath = new File(activity.getCacheDir(), "images");
                if (!cachePath.exists()) {
                    cachePath.mkdirs();
                }
                File imageFile = new File(cachePath, filename);
                FileOutputStream fos = new FileOutputStream(imageFile);
                fos.write(bytes);
                fos.flush();
                fos.close();

                Uri contentUri = FileProvider.getUriForFile(
                    activity,
                    activity.getPackageName() + ".fileprovider",
                    imageFile
                );

                Intent intent = new Intent(Intent.ACTION_SEND);
                intent.setType("image/png");
                intent.putExtra(Intent.EXTRA_STREAM, contentUri);
                if (caption != null && !caption.isEmpty()) {
                    intent.putExtra(Intent.EXTRA_TEXT, caption);
                }
                intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

                PackageManager pm = activity.getPackageManager();
                boolean hasWhatsApp = isAppInstalled("com.whatsapp", pm);
                boolean hasW4B = isAppInstalled("com.whatsapp.w4b", pm);

                if (hasWhatsApp) {
                    intent.setPackage("com.whatsapp");
                } else if (hasW4B) {
                    intent.setPackage("com.whatsapp.w4b");
                } else {
                    Intent chooser = Intent.createChooser(intent, "Share Sacred Status Card");
                    activity.startActivity(chooser);
                    return true;
                }

                activity.startActivity(intent);
                return true;
            } catch (Exception e) {
                e.printStackTrace();
                return false;
            }
        }

        @JavascriptInterface
        public boolean saveImageToGallery(String base64Image, String filename) {
            try {
                byte[] bytes = Base64.decode(base64Image, Base64.DEFAULT);
                ContentResolver resolver = activity.getContentResolver();
                ContentValues values = new ContentValues();
                values.put(MediaStore.Images.Media.DISPLAY_NAME, filename);
                values.put(MediaStore.Images.Media.MIME_TYPE, "image/png");

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    values.put(MediaStore.Images.Media.RELATIVE_PATH, Environment.DIRECTORY_PICTURES + "/Gita");
                    values.put(MediaStore.Images.Media.IS_PENDING, 1);
                }

                Uri uri = resolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
                if (uri != null) {
                    OutputStream out = resolver.openOutputStream(uri);
                    if (out != null) {
                        out.write(bytes);
                        out.flush();
                        out.close();
                    }
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                        values.clear();
                        values.put(MediaStore.Images.Media.IS_PENDING, 0);
                        resolver.update(uri, values, null, null);
                    }
                    return true;
                }
                return false;
            } catch (Exception e) {
                e.printStackTrace();
                return false;
            }
        }

        private boolean isAppInstalled(String packageName, PackageManager pm) {
            try {
                pm.getPackageInfo(packageName, 0);
                return true;
            } catch (PackageManager.NameNotFoundException e) {
                return false;
            }
        }
    }
}
