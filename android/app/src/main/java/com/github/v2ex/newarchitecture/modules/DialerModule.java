package com.github.v2ex.newarchitecture.modules;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = "Dialer")
public class DialerModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext context;

    public DialerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }

    @Override
    public String getName() {
        return "Dialer";
    }





    @ReactMethod
    public void call(String phone) {

        if (ContextCompat.checkSelfPermission(context, Manifest.permission.CALL_PHONE) != PackageManager.PERMISSION_GRANTED) {
            // 没有拨打电话的权限，请求权限
            ActivityCompat.requestPermissions(context.getCurrentActivity(), new String[]{Manifest.permission.CALL_PHONE}, 100);
        } else {
            // 已经获得了拨打电话的权限，可以执行拨打电话的操作
            Intent intent = new Intent(Intent.ACTION_CALL);
            Uri data = Uri.parse("tel:" + phone);
            intent.setData(data);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
        }
    }

}