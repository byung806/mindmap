import os
import requests
import json
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


def send_message_to_claude(
    message: str,
    instructions_file: Optional[str] = None,
    instructions_text: Optional[str] = None,
    additional_files: Optional[list] = None,
    api_key: Optional[str] = None,
    model: str = "anthropic/claude-sonnet-4.5",
    max_tokens: int = 4096
) -> dict:
    """
    Send a message to Claude Sonnet 4.5 via OpenRouter API.

    Args:
        message: The user message/query to send to Claude
        instructions_file: Optional path to a file containing instructions/context
        instructions_text: Optional instructions/context as a string (used if instructions_file is not provided)
        additional_files: Optional list of file paths to include in the message
        api_key: OpenRouter API key (if not provided, reads from OPENROUTER_API_KEY env var)
        model: The model to use (default: anthropic/claude-sonnet-4.5)
        max_tokens: Maximum tokens in the response

    Returns:
        dict: The API response
    """
    # Get API key from parameter or environment variable
    if api_key is None:
        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            raise ValueError("API key must be provided or set in OPENROUTER_API_KEY environment variable")

    # Load instructions from file if provided
    instructions = None
    if instructions_file:
        with open(instructions_file, 'r') as f:
            instructions = f.read()
    elif instructions_text:
        instructions = instructions_text

    # Build the user message content
    user_message_content = message

    # Add additional files to the message if provided
    if additional_files:
        for file_path in additional_files:
            with open(file_path, 'r') as f:
                file_content = f.read()
                file_name = os.path.basename(file_path)
                user_message_content += f"\n\n### {file_name}:\n```\n{file_content}\n```"

    # OpenRouter API endpoint
    url = "https://openrouter.ai/api/v1/chat/completions"

    # Request headers
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    # Build messages array
    messages = []

    # Add system/instructions message if provided
    if instructions:
        messages.append({
            "role": "system",
            "content": instructions
        })

    # Add user message
    messages.append({
        "role": "user",
        "content": user_message_content
    })

    # Request payload
    payload = {
        "model": model,
        "messages": messages,
        "max_tokens": max_tokens
    }

    # Send request
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()

    # Get the full response
    full_response = response.json()

    # Extract the assistant's message
    assistant_message = full_response["choices"][0]["message"]["content"]

    # Parse JSON from the response (remove markdown code blocks if present)
    json_content = assistant_message
    if json_content.startswith("```json"):
        json_content = json_content.split("```json")[1].split("```")[0].strip()
    elif json_content.startswith("```"):
        json_content = json_content.split("```")[1].split("```")[0].strip()

    # Parse and return just the JSON
    parsed_json = json.loads(json_content)
    return parsed_json


def main():
    """Example usage"""
    """
    # Example 1: Simple message without instructions
    print("=== Example 1: Simple message ===")
    message = "What is 2+2?"

    try:
        response = send_message_to_claude(message)
        assistant_message = response["choices"][0]["message"]["content"]
        print(f"Claude: {assistant_message}\n")
    except Exception as e:
        print(f"Error: {e}\n")
    """
    # Example 2: Message with instructions file and additional context file
    print("=== Example 2: With instructions file and context ===")

    user_input = 'Break down "React Hooks" into subtopics. I prefer interactive tutorials and official documentation.'

    try:
        # Call the function - now returns parsed JSON directly
        nodes_data = send_message_to_claude(
            message=user_input,
            instructions_file="nodeGenerationInstruction.txt",
            additional_files=["sampleGraph1.json"]
        )

        # Print the JSON response
        print(f"Claude's response:\n{json.dumps(nodes_data, indent=2)}\n")

        # Save the response to a JSON file
        output_file = "claude_response.json"
        with open(output_file, 'w') as f:
            json.dump(nodes_data, f, indent=2)

        print(f"\nResponse saved to: {output_file}")
    except Exception as e:
        print(f"Error: {e}\n")

    # Example 3: Node placement with multiple input files
    print("=== Example 3: Node placement with existing graph and new nodes ===")

    user_input = 'Place the new nodes into the existing graph structure.'

    try:
        # Call the function with node placement instructions
        placement_data = send_message_to_claude(
            message=user_input,
            instructions_file="nodePlacementInsturction.txt",
            additional_files=["claude_response.json", "sampleGraph1.json"]
        )

        # Print the JSON response
        print(f"Claude's response:\n{json.dumps(placement_data, indent=2)}\n")

        # Save the response to a JSON file
        output_file = "node_placement_response.json"
        with open(output_file, 'w') as f:
            json.dump(placement_data, f, indent=2)

        print(f"\nResponse saved to: {output_file}")
    except Exception as e:
        print(f"Error: {e}\n")

if __name__ == "__main__":
    main()
