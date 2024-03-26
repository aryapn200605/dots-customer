import json
import inquirer
import subprocess

API_URL = "https://mobile-customer.dotsco.re"

def write_to_file(file_name, text):
    try:
        with open(file_name, 'w') as file:
            file.write(text)
        print(f"Isi file {file_name} berhasil diubah.")
    except Exception as e:
        print(f"Terjadi kesalahan saat menulis ke {file_name}: {e}")

def run_expo_build():
    project_dir = "C:\\Users\\Arya Putra Nugroho\\Documents\\mobile_fe\\2\\dots-customer-v2"
    expo_build_command = "eas build --platform android"
    subprocess.run(["cmd", "/c", "start", "cmd", "/k", f"cd {project_dir} && {expo_build_command}"])

if __name__ == "__main__":
    with open('tenant.json') as f:
        tenant_data = json.load(f)
        choices = [tenant['name'] for tenant in tenant_data]

    questions = [
        inquirer.List(
            "type",
            message="Jenis build",
            choices=["apk", "abb"],
        ),
        inquirer.List(
            "tenants",
            message="Nama kantor",
            choices=choices,
        ),
        inquirer.Confirm(
            "correct",
            message="Apakah anda yakin dengan perubahan env ini?",
            default=True,
        ),
        inquirer.Confirm(
            "build",
            message="Apakah Anda ingin segera melakukan proses build?",
            default=False,
        ),
    ]

    answers = inquirer.prompt(questions)

    selected_tenant = None
    for tenant in tenant_data:
        if tenant['name'] == answers['tenants']:
            selected_tenant = tenant
            break

    public_id = selected_tenant['public_id']
    identity = selected_tenant['identity']
    name = selected_tenant['name']
    global_type = selected_tenant['global_type']
    
    if answers['correct'] :

        envText = f"""
API_URL={API_URL}
PUBLIC_ID={public_id}
APP_IDENTITY={identity}
APP_NAME={name}
APP_TYPE={global_type}
"""

        easText = f"""
{{
  "build": {{
    "production": {{
      "android": {{
        "buildType": "{'app-bundle' if answers['type'] == 'abb' else 'apk'}"
      }},
      "env": {{
        "API_URL": "{API_URL}",
        "PUBLIC_ID": "{public_id}",
        "APP_IDENTITY": "{identity}",
        "APP_NAME": "{name}",
        "APP_TYPE": "{global_type}"
      }}
    }}
  }}
}}
"""

        write_to_file(".env", envText)
        write_to_file("eas.json", easText)

        if answers['build']:
            run_expo_build()
