import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#333',
        textAlign: 'center',
    },
    inputContainer: {
        width: '100%',
        maxWidth: 400,
        marginBottom: 30,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        fontSize: 16,
        backgroundColor: '#F9FAFB',
        color: '#1F2937',
    },
    button: {
        width: '100%',
        maxWidth: 400,
        height: 50,
        backgroundColor: '#2563EB',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkText: {
        color: '#2563EB',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 16,
    },
    errorText: {
        color: '#DC2626',
        fontSize: 14,
        marginBottom: 16,
        textAlign: 'center',
    },
    logo: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#2563EB',
        marginBottom: 40,
        textAlign: 'center',
    }
}); 