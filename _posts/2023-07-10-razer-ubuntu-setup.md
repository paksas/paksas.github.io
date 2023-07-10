# Ubuntu 22.04 setup on Razer Blade 15 2022

## Closing the lid doesn't suspend the laptop

1. create a new file: `/etc/systemd/system/acpi-wake-andy.service`

```
[Unit]
Description=ACPI Wake Service
 
[Service]
Type=oneshot
ExecStart=/bin/sh -c "echo RP05 | sudo tee /proc/acpi/wakeup"
 
[Install]
WantedBy=multi-user.target
```

2. Enable that service

```
sudo systemctl start acpi-wake-andy.service
sudo systemctl enable acpi-wake-andy.service
sudo systemctl status acpi-wake-andy.service # check status
```

3. Create a new file `/etc/modprobe.d/nvidia-s2idle.conf`

```
options nvidia NVreg_EnableS0ixPowerManagement=1
NVreg_S0ixPowerManagementVideoMemoryThreshold=10000
```

4. Check status `cat /sys/power/mem_sleep`

If the contents are: `[s2idle] deep`, then you're done - reboot and test it that the reboot worked.
If the contents are `s2idle [deep]`, repeat step 5.

5. _Perform this step only if the above command output is_ `s2idle [deep]`

Edit file `/etc/default/grub`, adding `mem_sleep_default=s2idle` to `GRUB_CMDLINE_LINUX_DEFAULT`

```
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash mem_sleep_default=s2idle" 
```

6. run `sudo update-grub`

7. reboot, you're done test changes

